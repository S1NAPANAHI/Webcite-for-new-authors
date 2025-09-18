from playwright.sync_api import sync_playwright, expect
import time

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the admin login page
            page.goto("http://localhost:5173/admin/login", wait_until="networkidle")

            # Fill in the credentials
            page.get_by_label("Email").fill("sina.panahi200@gmail.com")
            page.get_by_label("Password").fill("1q2w3e4r5t")

            # Click the login button
            page.get_by_role("button", name="Log in").click()

            # The page reloads, so we need to wait for the new page to load.
            # The URL should change to /admin
            page.wait_for_url("http://localhost:5173/admin", timeout=10000)

            # Take a screenshot of the admin dashboard
            page.screenshot(path="jules-scratch/verification/admin_dashboard.png")

            # Navigate to the user management page
            page.get_by_role("link", name="Users").click()

            # Verify URL
            expect(page).to_have_url("http://localhost:5173/admin/users")

            # Wait for the user list to be populated
            # This is a good practice to ensure the page has loaded data
            time.sleep(2) # A simple wait to allow for data loading. A better way is to wait for an element.

            # Take a screenshot of the user management page
            page.screenshot(path="jules-scratch/verification/user_management.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()
