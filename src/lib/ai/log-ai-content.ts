import { prisma } from "@/lib/prisma";
import type { AiType } from "@/generated/prisma/enums";

export async function logAiContent(
  businessProfileId: string,
  type: AiType,
  input: string,
  output: string,
  model: string,
  tokensUsed = 0
) {
  try {
    await prisma.aiContent.create({
      data: {
        businessProfileId,
        type,
        input,
        output,
        model,
        tokensUsed,
      },
    });
  } catch {
    // Non-blocking audit log
  }
}
