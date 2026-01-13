// Data object inside the response
export interface ChatData {
  status: string;
  chat_response: ChatResponse;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}

// Chat response object
export interface ChatResponse {
  response: string;
}
