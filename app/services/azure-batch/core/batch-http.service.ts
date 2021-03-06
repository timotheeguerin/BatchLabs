import { Location } from "@angular/common";
import { HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpRequestOptions, HttpService, ServerError } from "@batch-flask/core";
import { UrlUtils } from "@batch-flask/utils";
import { AccountResource } from "app/models";
import { AccountService } from "app/services/account.service";
import { AdalService } from "app/services/adal";
import { BatchLabsService } from "app/services/batch-labs.service";
import { Constants } from "common";
import { Observable } from "rxjs";
import { flatMap, shareReplay, take } from "rxjs/operators";

@Injectable()
export class AzureBatchHttpService extends HttpService {
    public get serviceUrl() {
        return this.batchLabs.azureEnvironment.batchUrl;
    }

    constructor(
        httpHandler: HttpHandler,
        private adal: AdalService,
        private accountService: AccountService,
        private batchLabs: BatchLabsService) {
        super(httpHandler);
    }

    public request(method: any, uri?: any, options?: any): Observable<any> {
        return this.accountService.currentAccount.pipe(
            take(1),
            flatMap((account) => {
                const tenantId = account.subscription.tenantId;
                return this.adal.accessTokenData(tenantId, this.serviceUrl).pipe(
                    flatMap((accessToken) => {
                        options = this.addAuthorizationHeader(options, accessToken);
                        options = this._addApiVersion(options);
                        return super.request(
                            method,
                            this._computeUrl(uri, account),
                            options)
                            .retryWhen(attempts => this.retryWhen(attempts))
                            .catch((error) => {
                                const err = ServerError.fromBatchHttp(error);
                                return Observable.throw(err);
                            });
                    }),
                );
            }),
            shareReplay(1),
        );
    }

    private _addApiVersion(options: HttpRequestOptions): HttpRequestOptions {
        if (!(options.params instanceof HttpParams)) {
            options.params = new HttpParams(options.params);
        }

        if (!options.params.get("api-version")) {
            options.params = options.params.set("api-version", Constants.ApiVersion.batchService);
        }

        options.headers = (options.headers as any)
            .set("Content-Type", "application/json; odata=minimalmetadata; charset=utf-8");

        return options;
    }

    private _computeUrl(uri: string, account: AccountResource) {
        if (UrlUtils.isHttpUrl(uri)) {
            return uri;
        } else {
            return Location.joinWithSlash(`https://${account.properties.accountEndpoint}`, uri);
        }
    }
}
