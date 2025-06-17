"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"

interface ProductsPageFiltersProps {
  onFilterChange: (filters: { search: string; category: string; sort: string; page: number }) => void
}

export default function ProductsPageFilters({ onFilterChange }: ProductsPageFiltersProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)

  const applyFilters = () => {
    onFilterChange({ search, category, sort, page })
  }

  return (
    <div className="search-filters">
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm search-products"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex items-center justify-between mt-2">
        <Button type="button" onClick={() => { setCategory("All Categories"); applyFilters(); }}>
          All Categories
        </Button>
        <Button type="button" onClick={() => { setSort("newest"); applyFilters(); }}>
          Newest
        </Button>
        <Button type="button" onClick={() => { setSort("oldest"); applyFilters(); }}>
          Oldest
        </Button>
      </div>
      <div className="flex items-center justify-between mt-2">
        <Button type="button" onClick={() => { setPage(page > 1 ? page - 1 : 1); applyFilters(); }}>
          Prev
        </Button>
        <span>Page {page}</span>
        <Button type="button" onClick={() => { setPage(page + 1); applyFilters(); }}>
          Next
        </Button>
      </div>
    </div>
  )
}
