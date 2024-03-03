import { useAudioClipsStore } from "@/store/audioClips";

const storeAudioClips = useAudioClipsStore()

export const loadAudioClips = async (params) => {
    await storeAudioClips.loadAudioClips(params)
}
