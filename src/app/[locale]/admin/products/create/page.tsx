"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/providers/i18n-provider"
import { SimpleImageUpload } from "@/components/products/SimpleImageUpload"
import Image from "next/image"
import "../../admin.css"

interface Category {
  id: number
  name: string
}

export default function CreateProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { locale } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [productId, setProductId] = useState<number | null>(null)
  const [images, setImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    long_description: "",
    price: "",
    category_id: "",
    in_stock: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить категории",
          variant: "destructive",
        })
      }
    }

    fetchCategories()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      in_stock: checked,
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Название товара обязательно"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Краткое описание обязательно"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Цена обязательна"
    } else if (isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Цена должна быть положительным числом"
    }

    if (!formData.category_id) {
      newErrors.category_id = "Выберите категорию"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Log form data for debugging
      console.log('Form data before submission:', formData)
      console.log('Image file:', imageFile)

      // Create FormData instance
      const productFormData = new FormData()
      
      // Add all product data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'price') {
          productFormData.append(key, String(Number(value)))
        } else if (key === 'category_id') {
          productFormData.append(key, value ? String(Number(value)) : '')
        } else if (key === 'in_stock') {
          productFormData.append(key, String(Boolean(value ? 1 : 0)))
        } else {
          productFormData.append(key, String(value).trim())
        }
      })
      
      // Add image if selected
      if (imageFile) {
        productFormData.append('image', imageFile)
      }

      // Log FormData contents
      console.log('FormData entries:')
      for (let pair of productFormData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }

      // Make the request
      const response = await fetch("/api/products", {
        method: "POST",
        body: productFormData
      })

      console.log('Response status:', response.status)
      
      // Get the full response text for debugging
      const responseText = await response.text()
      console.log('Response text:', responseText)
      
      if (!response.ok) {
        // Try to parse the error response
        let errorMessage = 'Failed to create product'
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorData.details || errorMessage
        } catch (e) {
          console.error('Error parsing error response:', e)
        }
        throw new Error(errorMessage)
      }

      // Parse the success response
      let result
      try {
        result = JSON.parse(responseText)
      } catch (e) {
        console.error('Error parsing success response:', e)
        throw new Error('Invalid response from server')
      }

      if (!result || !result.id) {
        console.error('Invalid response structure:', result)
        throw new Error('Invalid response from server')
      }
      
      setProductId(result.id)

      toast({
        title: "Успех",
        description: "Товар успешно создан",
      })

      router.push(`/${locale}/admin/products`)
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать товар",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Добавить новый товар</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о товаре</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <Label htmlFor="name">Название товара</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="admin-form-error">{errors.name}</p>}
            </div>

            <div className="admin-form-group">
              <Label htmlFor="description">Краткое описание</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="admin-form-error">{errors.description}</p>}
            </div>

            <div className="admin-form-group">
              <Label htmlFor="long_description">Полное описание</Label>
              <Textarea
                id="long_description"
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                rows={6}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <Label htmlFor="price">Цена</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="admin-form-error">{errors.price}</p>}
              </div>

              <div className="admin-form-group">
                <Label htmlFor="category_id">Категория</Label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`admin-form-select ${errors.category_id ? "border-red-500" : ""}`}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="admin-form-error">{errors.category_id}</p>}
              </div>
            </div>

            <div className="admin-form-group">
              <div className="flex items-center space-x-2">
                <Switch id="in_stock" checked={formData.in_stock} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="in_stock">В наличии</Label>
              </div>
            </div>

            <div className="admin-form-group">
              <SimpleImageUpload
                onFileSelect={(file) => {
                  setImageFile(file);
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  const preview = URL.createObjectURL(file);
                  setImagePreview(preview);
                }}
                label="Перетащите изображение сюда"
                buttonText="Выбрать изображение"
              />
            </div>

            <div className="admin-form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${locale}/admin/products`)}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить товар"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
