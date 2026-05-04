import { create } from 'zustand'

interface QuestionnaireStore {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useQuestionnaireStore = create<QuestionnaireStore>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}))
