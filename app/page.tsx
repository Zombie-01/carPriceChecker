"use client";
import fetchCarPrices from "@/config/car";
import { brand, millages, models, statuss, wheels } from "@/config/filter";

import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Radio, RadioGroup } from "@heroui/radio";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import CarPriceStats from "./carPriceStats";
import Listings from "./list";
import { allBrands } from "@/config/all_json";

export default function CarPrice() {
  const dates = Array.from(
    { length: new Date().getFullYear() - 1992 + 1 },
    (_, index) => 1992 + index
  );
  const [load, setLoad] = useState(false);
  const [make, setMake] = useState("Toyota");
  const [model, setModel] = useState("wrangler");
  const [millage, setMillage] = useState("");
  const [buildDate, setBuildDate] = useState("2025");
  const [importDate, setImportDate] = useState("2025");
  const [wheel, setWheels] = useState("4");
  const [status, setStatus] = useState("");
  const [averagePrice, setAveragePrice] = useState<any>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Машины үнэ олох</h1>
      {load && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-white"></div>
        </div>
      )}
      <div className="flex w-full h-full gap-8">
        <Form
          className="w-full max-w-xs flex flex-col gap-4"
          validationBehavior="native"
          onSubmit={(e) => {
            e.preventDefault();
            setLoad(true);
            let data = Object.fromEntries(new FormData(e.currentTarget));
            // Find the selected mileage
            let mileageMin;
            let mileageMax;
            // Sort and parse millages
            if (millage && millage !== "" && millage !== "0") {
              const sortedMillages =
                millages
                  ?.map((m) => parseInt(m.dataId))
                  .sort((a, b) => a - b) || [];

              // Find the closest minimum mileage (lower or equal)
              mileageMin = sortedMillages.reduce(
                (prev, curr) =>
                  Math.abs(curr - parseInt(millage || "0")) <
                    Math.abs(prev - parseInt(millage || "0")) &&
                  curr <= parseInt(millage || "0")
                    ? curr
                    : prev,
                sortedMillages[0]
              );

              // Find the closest maximum mileage (greater or equal)
              mileageMax = sortedMillages.reduce(
                (prev, curr) =>
                  Math.abs(curr - parseInt(millage || "0")) <
                    Math.abs(prev - parseInt(millage || "0")) &&
                  curr >= parseInt(millage || "0")
                    ? curr
                    : prev,
                sortedMillages[sortedMillages.length - 1]
              );
            }

            // Find the selected build date

            // Sort and parse dates
            const sortedDates =
              dates?.map((d) => parseInt(`${d}`)).sort((a, b) => a - b) || [];

            // Find the closest minimum build date (lower or equal)
            const buildDateMin =
              sortedDates.reduce(
                (prev, curr) =>
                  Math.abs(curr - parseInt(`${buildDate}` || "0")) <
                    Math.abs(prev - parseInt(`${buildDate}` || "0")) &&
                  curr <= parseInt(`${buildDate}` || "0")
                    ? curr
                    : prev,
                sortedDates[0]
              ) || null;

            // Find the closest maximum build date (greater or equal)
            const buildDateMax =
              sortedDates.reduce(
                (prev, curr) =>
                  Math.abs(curr - parseInt(`${buildDate}` || "0")) <
                    Math.abs(prev - parseInt(`${buildDate}` || "0")) &&
                  curr >= parseInt(`${buildDate}` || "0")
                    ? curr
                    : prev,
                sortedDates[sortedDates.length - 1]
              ) || null;

            // Find the selected import date

            // Find the closest minimum import date (lower or equal)
            const importDateMin =
              sortedDates.reduce(
                (prev, curr) =>
                  Math.abs(curr - parseInt(`${importDate}` || "0")) <
                    Math.abs(prev - parseInt(`${importDate}` || "0")) &&
                  curr <= parseInt(`${importDate}` || "0")
                    ? curr
                    : prev,
                sortedDates[0]
              ) || null;

            // Find the closest maximum import date (greater or equal)
            const importDateMax =
              sortedDates.reduce(
                (prev, curr) =>
                  Math.abs(curr - parseInt(`${importDate}` || "0")) <
                    Math.abs(prev - parseInt(`${importDate}` || "0")) &&
                  curr >= parseInt(`${importDate}` || "0")
                    ? curr
                    : prev,
                sortedDates[sortedDates.length - 1]
              ) || null;

            console.log("Nearest Min Mileage:", mileageMin);
            console.log("Nearest Max Mileage:", mileageMax);
            console.log("Nearest Min Build Date:", buildDateMin);
            console.log("Nearest Max Build Date:", buildDateMax);
            console.log("Nearest Min Import Date:", importDateMin);
            console.log("Nearest Max Import Date:", importDateMax);

            // Call the fetchCarPrices function with the updated nearby values
            let result = fetchCarPrices(
              data?.makeBy.toString().toLowerCase(),
              data?.model.toString().toLowerCase(),
              buildDateMin?.toString() || "",
              buildDateMax?.toString() || "",
              importDateMin?.toString() || "",
              importDateMax?.toString() || "",
              wheel,
              data?.status.toString(),
              mileageMin?.toString() || "",
              mileageMax?.toString() || ""
            )
              .then((res) => {
                setAveragePrice(res as any);
              })
              .finally(() => setLoad(false));
          }}>
          <Select
            label="Үйлдвэрлэгч"
            name="makeBy"
            value={make}
            isRequired
            onChange={(e) => setMake(e.target.value)}>
            {allBrands?.map((b, i) => (
              <SelectItem textValue={b?.brand} value={b?.brand} key={b?.brand}>
                {b?.brand}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Загвар"
            name="model"
            isRequired
            disabled={make === ""}
            value={model}
            onChange={(e) => setModel(e.target.value)}>
            {allBrands
              .find((e) => e.brand === make)
              ?.models?.map((m) => (
                <SelectItem key={m} textValue={m} value={m}>
                  {m}
                </SelectItem>
              )) || []}
          </Select>
          <Input
            errorMessage="Please enter a valid millage"
            label="Явсан км"
            name="millage"
            value={millage}
            onChange={(e) => setMillage(e?.target?.value)}
            placeholder="Enter your millage"
            type="text"
          />
          <Select
            label="Хүрд"
            name="wheel"
            isRequired
            value={wheel}
            onChange={(e) => setWheels(e.target.value)}>
            {wheels?.map((m, i) => (
              <SelectItem
                key={m?.dataId}
                textValue={m?.dataId}
                value={m?.dataId}>
                {m.text}
              </SelectItem>
            ))}
          </Select>{" "}
          <Select
            label="Үйлдвэрлэсэн"
            name="build"
            value={buildDate}
            isRequired
            onChange={(e) => setBuildDate(e.target.value)}>
            {dates.map((year) => (
              <SelectItem key={year} textValue={`${year}`} value={year}>
                {year}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Орж ирсэн"
            name="import"
            isRequired
            value={importDate}
            onChange={(e) => setImportDate(e.target.value)}>
            {dates.map((year) => (
              <SelectItem key={year} textValue={`${year}`} value={year}>
                {year}
              </SelectItem>
            ))}
          </Select>
          <div className="flex flex-row gap-3">
            <RadioGroup
              label="Нөхцөл"
              name="status"
              isRequired
              value={status}
              onValueChange={setStatus}>
              {statuss?.map((m, i) => (
                <Radio value={m.value} key={i}>
                  {m.label}
                </Radio>
              ))}
            </RadioGroup>
          </div>
          <Button type="submit" className="mt-4">
            Бодох
          </Button>
        </Form>
        {averagePrice && (
          <div className="flex flex-col">
            <CarPriceStats
              minPrice={+averagePrice?.minPrice}
              maxPrice={+averagePrice?.maxPrice}
              averagePrice={+averagePrice?.averagePrice}
              carCount={+averagePrice?.carCount}
            />
            <Listings content={averagePrice?.content || []} />
          </div>
        )}
      </div>
    </div>
  );
}
