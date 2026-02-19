import { expect, test, type Page } from '@playwright/test'

const adminEmail = 'admin@sidoagung.com'
const adminPassword = 'password123'

async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await page.fill('input[name="email"]', adminEmail)
  await page.fill('input[name="password"]', adminPassword)
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/admin/)
}

test.describe('Logout API Guard', () => {
  test('POST /api/auth/logout clears access and /admin is guarded', async ({ page }) => {
    await loginAsAdmin(page)

    const cookiesBefore = await page.context().cookies()
    expect(cookiesBefore.some((cookie) => cookie.name === 'saf_access_token')).toBeTruthy()

    const response = await page.request.post('/api/auth/logout')
    expect(response.ok()).toBeTruthy()

    const payload = await response.json()
    expect(payload.success).toBeTruthy()

    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)

    const cookiesAfter = await page.context().cookies()
    expect(
      cookiesAfter.some((cookie) => cookie.name === 'saf_access_token' && cookie.value)
    ).toBeFalsy()
  })
})
