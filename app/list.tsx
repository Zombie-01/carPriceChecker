import { useEffect, useState } from "react";

const Listings = ({ content }: any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {content.map((item: any, index: number) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col">
            {/* Display the first image from the images array */}
            {item.images.length > 0 && (
              <div className="relative w-full h-48">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-t-lg bg-center object-center "
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-lg text-gray-700">{item.price}</p>
              <p className="text-sm text-gray-500 mt-2">{item.location}</p>

              {/* Dealer Info */}
              <div className="flex items-center mt-4">
                <a
                  href={item.dealerLink}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <span>{item.dealerName}</span>
                </a>
              </div>

              {/* Features */}
              <ul className="mt-4 space-y-2">
                {item.features.map((feature: any, index: number) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-center space-x-2">
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Listings;
