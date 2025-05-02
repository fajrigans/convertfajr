import React from 'react';

const ArticleCard = ({ title, content, date }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-700 text-lg mb-4">{content.slice(0, 300)}...</p>
      <p className="text-gray-500 text-sm">Published on {date}</p>
      <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700">
        Read More
      </button>
    </div>
  );
};

export default ArticleCard;
