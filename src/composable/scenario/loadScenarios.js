import { useScenariosStore } from "@/store/scenarios";

const storeScenario = useScenariosStore()

export const loadScenarios = async () => {
    await storeScenario.loadScenarios()
}
