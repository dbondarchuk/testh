import {
  ISelectorTypeProvider,
  SelectorTypeProviderInjectionToken,
  Service,
} from '@testh/sdk';
import { By } from 'selenium-webdriver';

/** XPath selector */
@Service(SelectorTypeProviderInjectionToken)
export class XPathSelectorTypeProvider implements ISelectorTypeProvider {
  get type(): string {
    return 'xpath';
  }

  by(value: string): By {
    return By.xpath(value);
  }
}

/** CSS selector */
@Service(SelectorTypeProviderInjectionToken)
export class CssSelectorTypeProvider implements ISelectorTypeProvider {
  get type(): string {
    return 'css';
  }

  by(value: string): By {
    return By.css(value);
  }
}

/** Selector by element's id */
@Service(SelectorTypeProviderInjectionToken)
export class IdSelectorTypeProvider implements ISelectorTypeProvider {
  get type(): string {
    return 'id';
  }

  by(value: string): By {
    return By.id(value);
  }
}

/** Selector by element's class */
@Service(SelectorTypeProviderInjectionToken)
export class ClassNameSelectorTypeProvider implements ISelectorTypeProvider {
  get type(): string {
    return 'class';
  }

  by(value: string): By {
    return By.className(value);
  }
}

/** Selector by element's name */
@Service(SelectorTypeProviderInjectionToken)
export class NameSelectorTypeProvider implements ISelectorTypeProvider {
  get type(): string {
    return 'name';
  }

  by(value: string): By {
    return By.name(value);
  }
}

/** Selector by element's text */
@Service(SelectorTypeProviderInjectionToken)
export class TextSelectorTypeProvider implements ISelectorTypeProvider {
  get type(): string {
    return 'text';
  }

  by(value: string): By {
    return By.xpath(`//*[contains(text(), '${value}')]`);
  }
}
