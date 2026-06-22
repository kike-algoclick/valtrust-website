import HomeSeller from "./homeseller";
import PropertyListServer from "@/components/shared/PropertyListServer";

export default function SellerPage() {
    return <HomeSeller listings={<PropertyListServer />} />;
}