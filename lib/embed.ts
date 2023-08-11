import supabase from "@/lib/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

export async function embedData(
  texts: string[],
  options?: {
    id?: string;
    type?: string;
  }
) {
  const vectorStore = await SupabaseVectorStore.fromTexts(
    texts,
    Array(texts.length).fill({
      type: options?.type,
      id: options?.id,
    }),
    new OpenAIEmbeddings(),
    {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    }
  );
}
