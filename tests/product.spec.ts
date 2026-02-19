import { expect, test } from '@playwright/test'

const adminEmail = 'admin@sidoagung.com'
const adminPassword = 'password123'

test.describe('Auth and Product Flow', () => {
  test('login success and login failure', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', adminEmail)
    await page.fill('input[name="password"]', adminPassword)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin/)

    await page.click('button:has-text("Logout")')
    await expect(page).toHaveURL(/\/login/)

    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)

    await page.goto('/login')
    await page.fill('input[name="email"]', adminEmail)
    await page.fill('input[name="password"]', 'wrong-password')
    await page.click('button[type="submit"]')
    await expect(page.getByText('Invalid credentials')).toBeVisible()
  })

  test('create category and verify it appears on public page', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', adminEmail)
    await page.fill('input[name="password"]', adminPassword)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin/)

    const categoryName = `Playwright Category ${Date.now()}`
    const categoryResponse = await page.request.post('/api/categories', {
      data: {
        name: categoryName,
        icon: 'Drumstick',
      },
    })
    expect(categoryResponse.ok()).toBeTruthy()

    await page.goto('/')
    await expect(page.getByText(categoryName)).toBeVisible()
  })

  test('create product with image upload and two nutrition rows', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', adminEmail)
    await page.fill('input[name="password"]', adminPassword)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin/)

    await page.goto('/admin/products/new')

    const categoryName = `Playwright Product Category ${Date.now()}`
    const categoryResponse = await page.request.post('/api/categories', {
      data: {
        name: categoryName,
        icon: 'Egg',
      },
    })
    const categoryPayload = await categoryResponse.json()
    expect(categoryResponse.ok()).toBeTruthy()

    await page.reload()

    const code = `PW-${Date.now()}`
    await page.fill('input[name="code"]', code)
    await page.fill('input[name="name"]', 'Playwright Product')
    await page.fill('textarea[name="description"]', 'Created by Playwright E2E test')
    await page.selectOption('select[name="sackColor"]', 'Hijau')
    await page.selectOption('select[name="categoryId"]', String(categoryPayload.data.id))

    await page.locator('input[type="file"]').setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4B6wAAAABJRU5ErkJggg==',
        'base64'
      ),
    })

    await page.fill('input[name="nutritions.0.label"]', 'Protein')
    await page.fill('input[name="nutritions.0.value"]', 'Min 20%')

    await page.click('button:has-text("Add Row")')
    await page.fill('input[name="nutritions.1.label"]', 'Lemak')
    await page.fill('input[name="nutritions.1.value"]', 'Min 5%')

    await page.click('button:has-text("Save Product")')
    await expect(page).toHaveURL(/\/admin\/products/)
    await expect(page.getByText('Product has been created.')).toBeVisible()

    await page.goto('/')
    await expect(page.getByText(code)).toBeVisible()
    await expect(page.getByText('Playwright Product')).toBeVisible()
  })
})
