import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
	id: number;
	name: string;
	email: string;
	role: number;
}

interface UserState {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set(() => ({ user })),
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
