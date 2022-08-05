// @ts-nocheck
import React from "react";

const Card = ({
  title,
  image,
  onClick,
}: {
  title: string;
  image: string;
  onClick: () => void;
}) => (
  <div className="max-w-sm rounded overflow-hidden shadow-lg" onClick={onClick}>
    <img className="w-full" src={image} alt="Sunset in the mountains" />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{title}</div>
      <p
        style={{
          alignItems: "center",
          textAlign: "center",
        }}
        className="text-gray-700 text-base"
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
        quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
        nihil.
      </p>
    </div>
    <div className="px-6 pt-4 pb-2">
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        #photography
      </span>
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        #travel
      </span>
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        #winter
      </span>
    </div>
  </div>
);

export default Card;
