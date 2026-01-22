declare const setup: (tfliteWasmPath: string) => Promise<void>;

declare const sampleRate = 16000;

declare const loadModel: ({ path, quant }: {
    path: string;
    quant?: "dynamic" | "f16" | undefined;
}) => Promise<void>;
type DtlnProcessorNodeOptions = {
    /**
     * the number of channels
     *
     * Preferred to set this value to 1 with mobile devices
     * for performance reasons.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
     * @default 2
     */
    channelCount: number;
};
declare const createDtlnProcessorNode: (ctx: BaseAudioContext, { channelCount }: DtlnProcessorNodeOptions) => ScriptProcessorNode;

declare const loadAecModel: ({ path, units, quant }: {
    path: string;
    units?: 512 | 128 | 256 | undefined;
    quant?: "dynamic" | "f16" | undefined;
}) => Promise<void>;
/**
 * connect mic first and lpb second
 */
declare const createDtlnAecProcessorNode: (ctx: BaseAudioContext) => ScriptProcessorNode;

export { DtlnProcessorNodeOptions, createDtlnAecProcessorNode, createDtlnProcessorNode, loadAecModel, loadModel, sampleRate, setup };
