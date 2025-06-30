import { IOutputRecord } from "../interfaces/IOutputRecord";

export interface ICategorizedOutput {
    /** Consume the entire given stream of records */
    write(stream: AsyncIterable<IOutputRecord>, cancelToken?: AbortSignal): Promise<void>;
}
