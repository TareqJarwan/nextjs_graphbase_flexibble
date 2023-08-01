'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categoryFilters } from "@/constants";

const Categories = () => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const category = searchParams.get('category');

    const handleTags = (filter: string) => {
        if (filter === category) return;
        router.push(`${pathName}?category=${filter}`);
    }

    return (
        <div className="flexBetween w-full gap-5 flex-wrap">
            <div className="flex gap-2 overflow-auto">
                {categoryFilters.map(filter => (
                    <button
                        key={filter}
                        type="button"
                        className={`
                            px-4 py-3 rounded-lg capitalize whitespace-nowrap border
                            ${category === filter ? 'bg-light-white-400 font-medium' : 'font-normal'}
                        `}
                        onClick={() => handleTags(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Categories