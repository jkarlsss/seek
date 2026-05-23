import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FilterIcon } from "lucide-react";
import { Separator } from "../../../components/ui/separator";
import FilterForm from "./filter-form";
import { Logo } from "./logo";

export function SelectionCard() {
  return (
    <Card className="w-full rounded-md">
      <CardHeader>
        <div className="flex">
          <FilterIcon className="size-5" />
          <span>Filters</span>
        </div>
        <Separator />
      </CardHeader>
      <CardContent>
        <FilterForm />
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
