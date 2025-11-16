import React from 'react';

const BlogPage: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 sm:p-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">Our Blog</h1>
            <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
                Coming Soon!
            </p>
            <p className="mt-2 text-stone-500 max-w-2xl mx-auto">
                We're working on bringing you insightful articles about construction, interior design trends, material guides, and much more. Stay tuned!
            </p>
        </div>
    );
};

export default BlogPage;
