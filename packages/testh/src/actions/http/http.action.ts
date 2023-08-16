import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  Safe,
} from '@testh/sdk';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/** Describes file for for FormData */
export class FormDataFile {
  /** File content */
  blob: Safe<Blob>;

  /** Optional filename to give */
  filename?: string;
}

/**
 * Properties for {@link HttpAction}
 */
export class HttpActionProperties implements IActionProperties {
  /** Request URL */
  url: string;

  /**
   * Request HTTP method
   * @default HttpMethod.GET
   */
  method?: HttpMethod;

  /** Request headers */
  headers?: Record<string, string>;

  /** Request body */
  body?: {
    /** Anything to be stringified as JSON */
    json?: any;

    /** Form data */
    form?: {
      /** Standard form values as pair of keys and values */
      values?: Record<string, string>;

      /** Files to upload. Pair of key and values */
      //@RecordType(FormDataFile)
      files?: Record<string, FormDataFile>;
    };

    /** Plain text */
    text?: string;
  };

  /**
   * Types of the response body to be parsed
   * @default none
   */
  responseType?: /** Response will be parsed as JSON */
  | 'json'
    /** Response will be passed as plain text */
    | 'text'
    /** Response will be parsed as Blob. Could be saved to file */
    | 'blob'
    /** No response body */
    | 'none';
}

/** Describes a result of HTTP request */
export class HttpActionResult {
  /** Status code */
  status: number;

  /** Status text */
  statusText: string;

  /** Response headers */
  headers: Record<string, string>;

  /** Redponse body */
  body: Safe<Blob> | string | any | undefined;

  /**
   * High resolution number of milliseconds that was spent to get the response.
   * It uses floating-point numbers with up to microsecond precision.
   */
  responseTime: number;
}

/**
 * Action type aliases
 */
export const HttpActionTypeAliases = ['rest', 'http'] as const;

/**
 * Makes an HTTP REST call and returns the response object
 * @properties {@link HttpActionProperties}
 * @runnerType {@link HttpActionTypeAliases}
 * @result {@link HttpActionResult} HTTP result
 */
@Action(HttpActionProperties, 'HTTP call', ...HttpActionTypeAliases)
export class HttpAction extends IAction<
  HttpActionProperties,
  HttpActionResult
> {
  private readonly logger: ILogger;

  constructor(props: HttpActionProperties, loggerFactory: ILoggerFactory) {
    super(props);

    this.logger = loggerFactory.get<HttpAction>(HttpAction);
  }

  public async run(_: IState): Promise<HttpActionResult> {
    this.logger.info(
      `Making HTTP call to ${this.props.url} with method ${
        this.props.method || HttpMethod.GET
      }`,
    );

    let body: BodyInit | undefined = undefined;
    if (this.props?.body?.json) {
      body = JSON.stringify(this.props.body.json);
    } else if (this.props?.body?.form) {
      const formData = new FormData();
      if (this.props.body.form.values) {
        for (const key in this.props.body.form.values) {
          formData.set(key, this.props.body.form.values[key]);
        }
      }

      if (this.props.body.form.files) {
        for (const key in this.props.body.form.files) {
          const file = this.props.body.form.files[key];
          formData.set(key, file.blob(), file.filename);
        }
      }

      body = formData;
    } else if (this.props?.body?.text) {
      body = this.props.body.text;
    }

    const startTime = performance.now();

    const response = await fetch(this.props.url, {
      method: this.props.method,
      headers: this.props.headers,
      body: body,
    });

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    this.logger.info(
      `Received response from ${this.props.url}: STATUS ${response.status}`,
    );

    const responseHeaders: Record<string, string> = {};
    for (const header of response.headers.keys()) {
      responseHeaders[header] = response.headers[header];
    }

    let responseBody: any;
    switch (this.props.responseType) {
      case 'json':
        responseBody = await response.json();
        break;

      case 'text':
        responseBody = await response.text();
        break;

      case 'blob': {
        const blob = await response.blob();
        responseBody = (() => blob) as Safe<Blob>;
        break;
      }

      case 'none':
      default:
        break;
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      responseTime,
    };
  }
}
