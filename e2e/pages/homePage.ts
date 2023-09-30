import { expect, Page, Locator } from '@playwright/test'
import { links } from '../test-data/homePageLinks.json'

class HomePage {
  private page: Page
  private url = '/'
  private header!: Locator
  private subheading!: Locator
  private allLinks!: Locator

  constructor(page: Page) {
    this.page = page
    this.header = this.page.locator("h1[class='heading']")
    this.subheading = this.page.locator('h2')
    this.allLinks = this.page.locator('ul li a')
  }

  /**
   * Navigates to the home page
   */
  async visit(): Promise<void> {
    await this.page.goto(this.url)
  }

  /**
   * Asserts the header is visible on the screen
   */
  async assertHeaderPresent(): Promise<void> {
    await expect(this.header).toBeVisible()
  }

  /**
   * Assert the header text is the same as the passed value
   * @param expected The value we expect the header to have
   */
  async assertHeaderText(expected: string): Promise<void> {
    await expect(this.header).toHaveText(expected)
  }

  /**
   * Asserts the subheading is visible on the screen
   */
  async assertSubheadingPresent(): Promise<void> {
    await expect(this.subheading).toBeVisible()
  }

  /**
   * Assert the subheading text is the same as the passed value
   * @param expected The value we expect the subheading to have
   */
  async assertSubheadingText(expected: string): Promise<void> {
    await expect(this.subheading).toHaveText(expected)
  }

  /**
   * Assert we have the expected number of links on the page
   * @param expected Number of links to expect
   */
  async assertNumberOfLinks(expected: number): Promise<void> {
    const count = await this.allLinks.count()
    await expect(count).toEqual(expected)
  }

  /**
   * Reads the list of links from the homePageLinks.json
   * Loops through each link and checks we have a link on the page with that text and href
   */
  async assertLinksAreCorrect(): Promise<void> {
    // Loops through the import json file which is an array of objects
    // The array is called links and each object contains text and a href
    for (let index = 0; index < links.length; index++) {
      // Get the element with the link text from the JSON file
      const linkText = links[index].text
      const link = this.page.locator(`a:text-is("${linkText}")`)
      console.log('Current link text: ' + linkText)

      // Get the href of the current link
      const href = await link.getAttribute('href')
      console.log('Current href: ' + href)

      // Expect the href matches the one we have in the JSON file
      expect(
        href,
        'Failed to match found: ' + href + ' expected: ' + links[index].href
      ).toEqual(links[index].href)
    }
  }
}

export { HomePage }
