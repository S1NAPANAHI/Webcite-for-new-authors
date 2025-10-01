import React from 'react';
import { Download } from 'lucide-react';

const DownloadAppPage: React.FC = () => {
  // Placeholder for the actual APK download link
  const apkDownloadLink = "#"; // Replace with your actual APK link

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Zoroastervers Ebook Reader App</h1>
        <p className="text-lg text-gray-600 mb-8">
          Immerse yourself in the ancient wisdom of Zoroastrian texts with our dedicated Ebook Reader App.
          Enjoy a seamless reading experience, offline access, and a beautifully designed interface.
        </p>

        <div className="mb-8">
          {/* Placeholder for app icon/logo */}
          <div className="mx-auto w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-5xl text-blue-700">📚</span>
          </div>
          <p className="text-sm text-gray-500">Version 1.0.0</p>
        </div>

        <a
          href={apkDownloadLink}
          download
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <Download className="w-5 h-5 mr-3" />
          Download APK Directly
        </a>

        <p className="text-sm text-gray-500 mt-6">
          (Note: This app is currently available for direct download only. Google Play Store coming soon!)
        </p>

        <div className="mt-10 text-left border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Installation Instructions:</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Download the APK file to your Android device.</li>
            <li>Locate the downloaded file in your device's "Downloads" folder or notification bar.</li>
            <li>Tap on the APK file to begin installation.</li>
            <li>If prompted, enable "Install from Unknown Sources" in your device settings.</li>
            <li>Follow the on-screen instructions to complete the installation.</li>
            <li>Launch the Zoroastervers Ebook Reader App and start exploring!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppPage;
