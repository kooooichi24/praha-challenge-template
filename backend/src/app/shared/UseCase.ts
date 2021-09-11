export interface UseCase<IRequest, IResponse> {
  do(request?: IRequest): Promise<IResponse> | IResponse
}
