import { Transform, TransformationType } from "class-transformer";
import { WebElement } from "selenium-webdriver";

/**
 * Decorator to transform {@see WebElement} item
 * @returns Transformed object
 */
 export function ToWebElement() {
    return Transform((params) => {
      const value = params.value as WebElement;

      if (params.type === TransformationType.PLAIN_TO_CLASS) {
        return value ? new WebElement(value.getDriver(), value.getId()) : null;
      }
  
      if (params.type === TransformationType.CLASS_TO_PLAIN) {
        return params.value
      }
  
      return params.value;
    });
  }
  