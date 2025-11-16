import React from 'react';

const CareersPage: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 sm:p-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">Careers at WEMISI</h1>
            <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
                Join our team and help us build beautiful spaces. We are passionate about quality, design, and customer satisfaction.
            </p>
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-stone-800">Current Openings</h2>
                <p className="mt-3 text-stone-500">
                    There are no open positions at the moment. Please check back later or send your CV to <a href="mailto:careers@wemisi.com" className="text-stone-700 font-medium hover:underline">careers@wemisi.com</a> for future consideration.
                </p>
            </div>
        </div>
    );
};

export default CareersPage;
