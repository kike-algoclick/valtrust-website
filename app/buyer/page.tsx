import LandingBuyer from "./LandingBuyer";
import PropertyListServer from "@/components/shared/PropertyListServer";

export default function BuyerPage() {
    return <LandingBuyer listings={<PropertyListServer />} />;
}
