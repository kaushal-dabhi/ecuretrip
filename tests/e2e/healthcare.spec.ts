import { test, expect } from '@playwright/test';

test.describe('Healthcare EMR System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('http://localhost:3000');
  });

  test('Patient login flow', async ({ page }) => {
    // Click on patient portal
    await page.click('text=Patient Portal');
    
    // Should redirect to patient dashboard
    await expect(page).toHaveURL(/.*patient.*dashboard/);
    
    // Check if patient dashboard loads
    await expect(page.locator('h1')).toContainText('Patient Dashboard');
  });

  test('Document upload workflow', async ({ page }) => {
    // Navigate to patient dashboard
    await page.goto('http://localhost:3000/patient/dashboard');
    
    // Create a test file
    const testFile = Buffer.from('test content');
    
    // Upload file
    await page.setInputFiles('input[type="file"]', {
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: testFile,
    });
    
    // Click upload button
    await page.click('button:has-text("Upload")');
    
    // Wait for upload to complete
    await expect(page.locator('text=Uploading...')).toBeVisible();
    
    // Should show success message or status
    await expect(page.locator('text=Document uploaded successfully')).toBeVisible();
  });

  test('Doctor case review', async ({ page }) => {
    // Navigate to doctor cases
    await page.goto('http://localhost:3000/doctor/cases');
    
    // Check if cases table loads
    await expect(page.locator('table')).toBeVisible();
    
    // Click on a case to view details
    await page.click('tr:first-child');
    
    // Should navigate to case detail page
    await expect(page).toHaveURL(/.*cases.*\d+/);
  });

  test('Admin billing workflow', async ({ page }) => {
    // Navigate to admin billing
    await page.goto('http://localhost:3000/admin/billing');
    
    // Create a quote
    await page.click('button:has-text("Create Quote")');
    
    // Fill quote form
    await page.fill('input[name="description"]', 'Consultation');
    await page.fill('input[name="amount"]', '500');
    
    // Submit quote
    await page.click('button:has-text("Submit")');
    
    // Should show quote created
    await expect(page.locator('text=Quote created successfully')).toBeVisible();
  });

  test('OHIF viewer integration', async ({ page }) => {
    // Navigate to a case with imaging
    await page.goto('http://localhost:3000/doctor/cases/123');
    
    // Click on imaging viewer
    await page.click('button:has-text("View Imaging")');
    
    // Should open OHIF viewer
    await expect(page).toHaveURL(/.*viewer.*/);
    
    // Check if viewer loads
    await expect(page.locator('.ohif-viewer')).toBeVisible();
  });

  test('Authentication and authorization', async ({ page }) => {
    // Try to access admin page without proper role
    await page.goto('http://localhost:3000/admin/cases');
    
    // Should redirect to unauthorized or login
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/.*(unauthorized|login).*/);
  });

  test('Responsive design', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to patient dashboard
    await page.goto('http://localhost:3000/patient/dashboard');
    
    // Check if layout adapts to mobile
    await expect(page.locator('.grid')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('Error handling', async ({ page }) => {
    // Try to access non-existent page
    await page.goto('http://localhost:3000/non-existent');
    
    // Should show 404 or error page
    await expect(page.locator('text=404') || page.locator('text=Not Found')).toBeVisible();
  });

  test('Performance', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('http://localhost:3000/patient/dashboard');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});
