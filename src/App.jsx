import { useEffect, useMemo, useState } from 'react'

import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import CategoryGrid from './components/CategoryGrid.jsx'
import ProductListView from './components/ProductListView.jsx'
import ProductDetailView from './components/ProductDetailView.jsx'

import { categories, products } from './data/catalog.js'

function SectionShell({ children }) {
  return (
    <section id="katalog" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {children}
      </div>
    </section>
  )
}

export default function App() {
  const [view, setView] = useState('categories') // categories | list | detail
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState(null)

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) || null,
    [selectedCategoryId]
  )

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [selectedProductId]
  )

  useEffect(() => {
    // Keep the UX snappy on mobile when changing views
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  const openCategory = (categoryId) => {
    setSelectedCategoryId(categoryId)
    setSelectedProductId(null)
    setView('list')
  }

  const backToCategories = () => {
    setSelectedProductId(null)
    setSelectedCategoryId(null)
    setView('categories')
  }

  const openProduct = (productId) => {
    setSelectedProductId(productId)
    setView('detail')
  }

  const backToList = () => {
    setSelectedProductId(null)
    setView('list')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main>
        <Hero />

        <SectionShell>
          {view === 'categories' ? (
            <CategoryGrid onSelectCategory={openCategory} />
          ) : null}

          {view === 'list' && selectedCategory ? (
            <ProductListView
              category={selectedCategory}
              onBack={backToCategories}
              onOpenProduct={openProduct}
            />
          ) : null}

          {view === 'detail' && selectedProduct ? (
            <ProductDetailView product={selectedProduct} onBack={backToList} />
          ) : null}
        </SectionShell>
      </main>

      <footer className="border-t border-white/20 bg-farm-green-dark text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-white sm:px-6">
          (c) {new Date().getFullYear()} Sidoagung Farm - Product Catalog
        </div>
      </footer>
    </div>
  )
}
