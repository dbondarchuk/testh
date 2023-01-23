import { Type } from 'class-transformer';
import { By, locateWith, RelativeBy } from 'selenium-webdriver';
import { container } from 'tsyringe';
import { resolveAll } from '../../containers/container';
import { InvalidSelectorTypeException } from '../exceptions/invalidSelectorTypeException';
import {
  ISelectorTypeProvider,
  SelectorTypeProviderInjectionToken,
} from '../extensions/services/selenium/iSelectorTypeProvider';
import { ILoggerFactory, LoggerFactoryInjectionToken } from '../logger';
import { RelativeSelector } from './relativeSelector';

/**
 * Describes a selector
 */
export class Selector {
  /**
   * Type of the Selector
   */
  public type: string;

  /**
   * Selector value
   */
  public value: string;

  @Type(() => RelativeSelector)
  public relative?: RelativeSelector[];

  /**
   * Gets selenium By object
   */
  public get by(): By | RelativeBy {
    let by: By = null;

    const logger = container
      .resolve<ILoggerFactory>(LoggerFactoryInjectionToken)
      .get<Selector>(Selector);
    const providers = resolveAll<ISelectorTypeProvider>(
      SelectorTypeProviderInjectionToken,
    );

    logger.debug(`Resolving *by* for selector ${this}`);

    for (const provider of providers) {
      if (provider.type === this.type) {
        by = provider.by(this.value);

        logger.debug(
          `Resolved selector type '${this.type}' using '${provider.constructor.name}'`,
        );
        break;
      }
    }

    if (!by) {
      throw new InvalidSelectorTypeException(this.type);
    }

    if (!this.relative || this.relative.length == 0) {
      return by;
    }

    logger.debug(`Selector ${this} is relative. Building a relation..`);

    const relative = this.relative.reduce((relativeBy, item) => {
      switch (item.type) {
        case 'above':
          return relativeBy.above(item.element ?? item.to.by);
        case 'below':
          return relativeBy.below(item.element ?? item.to.by);
        case 'left':
          return relativeBy.toLeftOf(item.element ?? item.to.by);
        case 'right':
          return relativeBy.toRightOf(item.element ?? item.to.by);
        case 'near':
          return relativeBy.near(item.element ?? item.to.by);
        default:
          throw new InvalidSelectorTypeException(
            `Unknown relative selector type: ${item.type}`,
          );
      }
    }, locateWith(by));

    logger.debug(`Successfully built relation for selector ${this}`);

    return relative;
  }

  toString(): string {
    return `type=${this.type},value=${this.value},relative=${
      this.relative ? JSON.stringify(this.relative) : 'none'
    }`;
  }
}
