import * as cheerio from "cheerio";

// Function to fetch car prices based on provided criteria
const fetchCarPrices = async (
  make: string,
  model: string,
  mileageMin: string,
  mileageMax: string,
  yearMin: string,
  yearMax: string,
  oYearMin: string,
  oYearMinMax: string,
  wheel: string,
  status: string
): Promise<any | null> => {
  const baseUrl = "https://www.unegui.mn/avto-mashin/-avtomashin-zarna/";
  const queryParams = `${make}/${model}/condition---${status}/milliage_max---${mileageMax}/milliage_min---${mileageMin}/oyear_max---${oYearMinMax}/oyear_min---${oYearMin}/ruli---${wheel}/year_max---${yearMax}/year_min---${yearMin}/`;
  const fullUrl = baseUrl + queryParams;

  const prices: number[] = [];
  let currentPage = 1;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const response = await fetch(
        `/api/proxy?url=${encodeURIComponent(fullUrl)}&page=${currentPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Parse prices from the current page
      $(".advert__content-price._not-title").each(
        (index: number, priceTag: any) => {
          const priceText = $(priceTag)
            .text()
            .trim()
            .replace("₮", "")
            .replace(",", "");
          const price = parseFloat(priceText);
          if (!isNaN(price)) {
            prices.push(price);
          }
        }
      );

      // Check for next page
      const nextPageLink = $(".number-list .js-page-filter").last();
      if (
        nextPageLink.attr("data-page") &&
        nextPageLink.attr("data-page") !== currentPage.toString()
      ) {
        currentPage++;
      } else {
        hasNextPage = false;
      }
    }

    if (prices.length > 0) {
      // Calculate min, max, and average prices
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const averagePrice =
        prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const carCount = prices.length;

      console.log(`Хамгийн бага үнэ: ₮${minPrice.toFixed(2)} сая`);
      console.log(`Хамгийн их үнэ: ₮${maxPrice.toFixed(2)} сая`);
      console.log(
        `Дундаж үнэ: ₮${averagePrice.toFixed(2)} сая (Нийт ${carCount} машины дундаж)`
      );

      return {
        minPrice,
        maxPrice,
        averagePrice,
        carCount
      };
    } else {
      console.log("Үнийн мэдээлэл олдсонгүй.");
      alert("Үнийн мэдээлэл олдсонгүй.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching car prices:", error);
    return null;
  }
};

export default fetchCarPrices;
