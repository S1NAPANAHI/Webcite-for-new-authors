import React from 'react';

const ReadingHistoryPage: React.FC = () => {
  return (
    <div className="text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Reading History</h1>
      <p className="text-lg mb-8">Track your reading progress and history.</p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">All Books</h2>
        {/* Example Book Entry - The Gathas of Zarathushtra */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-4 flex items-center space-x-6">
          <div className="flex-shrink-0 w-24 h-32 bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-center text-sm">
            Cover
          </div>
          <div>
            <h3 className="text-xl font-bold">The Gathas of Zarathushtra</h3>
            <p className="text-gray-400">Zarathushtra</p>
            <p className="text-sm text-gray-500 mt-2">Religious Text</p>
            <p className="text-sm text-blue-400">Progress: 75%</p>
            <p className="text-sm text-gray-500">Page 240 of 320</p>
            <p className="text-sm text-gray-500">Last read 2 days ago</p>
            <a
              href="/apps/frontend/src/reader/reader.html?book=the-gathas.epub"
              className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Continue Reading
            </a>
          </div>
        </div>

        {/* Example Book Entry - The Denkard */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-4 flex items-center space-x-6">
          <div className="flex-shrink-0 w-24 h-32 bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-center text-sm">
            Cover
          </div>
          <div>
            <h3 className="text-xl font-bold">The Denkard</h3>
            <p className="text-gray-400">Various Authors</p>
            <p className="text-sm text-gray-500 mt-2">Religious Text</p>
            <p className="text-sm text-blue-400">Progress: 30%</p>
            <p className="text-sm text-gray-500">Page 135 of 450</p>
            <p className="text-sm text-gray-500">Last read 1 week ago</p>
            <a
              href="/apps/frontend/src/reader/reader.html?book=the-denkard.epub"
              className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Continue Reading
            </a>
          </div>
        </div>

        {/* Example Book Entry - Zoroastrianism: An Introduction */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-4 flex items-center space-x-6">
          <div className="flex-shrink-0 w-24 h-32 bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-center text-sm">
            Cover
          </div>
          <div>
            <h3 className="text-xl font-bold">Zoroastrianism: An Introduction</h3>
            <p className="text-gray-400">Jenny Rose</p>
            <p className="text-sm text-gray-500 mt-2">Non-Fiction</p>
            <p className="text-sm text-green-400">Progress: 100%</p>
            <p className="text-sm text-gray-500">Page 280 of 280</p>
            <p className="text-sm text-gray-500">Last read 3 weeks ago</p>
            <a
              href="/apps/frontend/src/reader/reader.html?book=zoroastrianism-intro.epub"
              className="mt-3 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Read Again
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingHistoryPage;