"use client";

import { Suspense } from "react";

interface SearchParamsProviderProps {
    children: React.ReactNode;
}

const SearchParamsProvider: React.FC<SearchParamsProviderProps> = ({ children }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    );
};

export default SearchParamsProvider;