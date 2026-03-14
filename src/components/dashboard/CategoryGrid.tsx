import { categories } from "@/lib/data/categories";
import { CategoryCard } from "./CategoryCard";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
