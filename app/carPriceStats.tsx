import React, { useState, useEffect } from "react";

interface PriceStats {
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  carCount: number;
}

const CarPriceStats = (stats: PriceStats) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white w-full rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Үр дүн</h2>

      {stats ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Хамгийн бага үнэ:</p>
            <p className="font-bold text-green-500">
              ₮{stats.minPrice.toFixed(2)} сая
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Хамгийн их үнэ:</p>
            <p className="font-bold text-red-500">
              ₮{stats.maxPrice.toFixed(2)} сая
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Дундаж үнэ:</p>
            <p className="font-bold text-blue-500">
              ₮{stats.averagePrice.toFixed(2)} сая
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Нийт машины тоо:</p>
            <p className="font-bold text-gray-800">{stats.carCount}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading price data...</p>
      )}
    </div>
  );
};

export default CarPriceStats;
