
function normalizeBool(value: any): boolean | null {
  if (value === true || value === false) return value;

  if (typeof value === "string") {
    const v = value.toLowerCase().trim();

    if (v === "true" || v === "yes" || v === "1") return true;
    if (v === "false" || v === "no" || v === "0") return false;
  }

  return null;
}

function normalizeText(str: any) {
  if (!str) return "";

  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeId(str: any) {
  if (!str) return "";

  return str
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function isSimilar(a: string, b: string) {
  if (!a || !b) return false;

  const cleanA = normalizeText(a);
  const cleanB = normalizeText(b);

  if (cleanA === cleanB) {
    return true;
  }

  const wordsA = cleanA.split(" ").sort();
  const wordsB = cleanB.split(" ").sort();

  return JSON.stringify(wordsA) === JSON.stringify(wordsB);
}
function calculateAgeAtDate(
  birthDateStr: string,
  referenceDateStr: string
): number | null {

  if (!birthDateStr || !referenceDateStr) {
    return null;
  }

  const birthDate = new Date(birthDateStr);
  const referenceDate = new Date(referenceDateStr);

  if (
    isNaN(birthDate.getTime()) ||
    isNaN(referenceDate.getTime())
  ) {
    return null;
  }

  let age =
    referenceDate.getFullYear() -
    birthDate.getFullYear();

  const monthDiff =
    referenceDate.getMonth() -
    birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (
      monthDiff === 0 &&
      referenceDate.getDate() < birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
}

export function verifyProperty(
  deedData: any,
  excerptData: any,
  duiData?: any
) {

  if (!deedData?.success) {
  return {
    verified: false,
    score: 0,
    error: "Invalid deed document"
  };
}

if (!excerptData?.success) {
  return {
    verified: false,
    score: 0,
    error: "Invalid excerpt document"
  };
}

if (!duiData?.success) {
  return {
    verified: false,
    score: 0,
    error: "Invalid DUI document"
  };
}


  const deedBuyer = normalizeText(
    deedData?.buyer?.name
  );
  const deedBuyerAge =
  Number(deedData?.buyer?.age) || null;

  const deedDate =
    deedData?.deedDate || null;

  const duiBirthDate =
    duiData?.person?.birthDate || null;

  const excerptOwner = normalizeText(
    excerptData?.owner?.name
  );

  const ownerMatch = isSimilar(
    deedBuyer,
    excerptOwner
  );


  const duiOwner = normalizeText(
    duiData?.person?.fullName
  );

  const duiNameMatch =
    duiOwner.length > 0
      ? isSimilar(deedBuyer, duiOwner)
      : true;

  const calculatedAgeAtSale =
  calculateAgeAtDate(
    duiBirthDate,
    deedDate
  );

  const ageMatch =
    deedBuyerAge === null ||
    calculatedAgeAtSale === null
      ? true
      : Math.abs(
        deedBuyerAge -
        calculatedAgeAtSale
      ) <= 1;


  let duiMatch = true;

  if (
    deedData?.buyer?.dui &&
    duiData?.person?.dui
  ) {
    const deedDui = normalizeId(
      deedData.buyer.dui
    );

    const duiNumber = normalizeId(
      duiData.person.dui
    );

    duiMatch = deedDui === duiNumber;
  }


  const deedMatricula = normalizeId(
    deedData?.property?.matricula
  );

  const excerptMatricula = normalizeId(
    excerptData?.property?.matricula
  );

  const matriculaMatch =
    deedMatricula.length > 0 &&
    excerptMatricula.length > 0 &&
    deedMatricula === excerptMatricula;

  const deedType = normalizeText(
    deedData?.property?.type
  );

  const excerptType = normalizeText(
    excerptData?.property?.type
  );

  const propertyTypeMatch =
    !deedType ||
    !excerptType
      ? true
      : deedType === excerptType;


  const deedMortgage = normalizeBool(
    deedData?.encumbrances?.mortgage
  );

  const excerptMortgage = normalizeBool(
    excerptData?.encumbrances?.mortgage
  );

  const mortgageMatch =
    deedMortgage === null ||
    excerptMortgage === null
      ? true
      : deedMortgage === excerptMortgage;



  let score = 0;
  let maxScore = 0;

  const addCheck = (
    condition: boolean,
    weight: number
  ) => {
    maxScore += weight;

    if (condition) {
      score += weight;
    }
  };

  addCheck(ownerMatch, 30);
  addCheck(matriculaMatch, 30);
  addCheck(duiNameMatch, 15);
  addCheck(ageMatch, 15);
  addCheck(duiMatch, 5);
  addCheck(propertyTypeMatch, 3);
  addCheck(mortgageMatch, 2);

  const percentage =
    maxScore === 0
      ? 0
      : Math.round(
          (score / maxScore) * 100
        );

  // ──────────────────────────────
  // ALERTS
  // ──────────────────────────────

  const alerts = {
    suspiciousName:
      deedBuyer.length < 5 ||
      excerptOwner.length < 5,

    missingFields:
      !deedBuyer ||
      !excerptOwner ||
      !deedMatricula ||
      !excerptMatricula,

    inconsistentData:
      ownerMatch &&
      !matriculaMatch,

    ageMismatch:
      deedBuyerAge !== null &&
      calculatedAgeAtSale !== null &&
      !ageMatch
  };

  const criticalAlert =
    alerts.suspiciousName ||
    alerts.missingFields;

  // ──────────────────────────────
  // FINAL VERDICT
  // ──────────────────────────────

  const verified =
    ownerMatch &&
    matriculaMatch &&
    duiNameMatch &&
    duiMatch &&
    ageMatch &&
    percentage >= 70 &&
    !criticalAlert;

  return {
    verified,

    score: percentage,

    ownerMatch,
    matriculaMatch,

    duiNameMatch,
    duiMatch,
    ageMatch,

    propertyTypeMatch,
    mortgageMatch,

    alerts,

    deedBuyer,
    excerptOwner,
    duiOwner,

    deedBuyerAge,
    calculatedAgeAtSale,

    deedMatricula,
    excerptMatricula
  };
}