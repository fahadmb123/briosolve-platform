export class VerificationFile {
    constructor(
        public readonly id: string,
        public readonly document_id: string,
        public readonly file_url: string,
        public readonly created_at: Date
    ){}
}
