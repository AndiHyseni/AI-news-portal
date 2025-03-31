// interfaces
import { ResponseModel } from '../interfaces/models';
import { StatusCodeEnums } from '../interfaces/enums';

// baseStatusResponse
import { baseStatusResponse } from './baseStatusResponse';

export const ok = (data: object, httpCode = 200): ResponseModel => ({
    data: { ...baseStatusResponse, statusDate: new Date(), ...data },
    httpCode
});

export const failure = (
    data: any,
    statusCode: StatusCodeEnums = StatusCodeEnums.UNEXPECTED,
    httpCode = 200
): ResponseModel => ({
    data: {
        ...baseStatusResponse,
        statusCode,
        statusIsOk: false,
        statusDate: new Date(),
        statusMessage: typeof data === 'string' ? data : 'Something went wrong',
        ...(typeof data !== 'string' && { ...data })
    },
    httpCode
});

export const found = (
    result: Object | number | string | undefined,
    message: string
): ResponseModel => {
    return !!result ? ok({ result }) : failure(message, StatusCodeEnums.UNEXPECTED);
};
