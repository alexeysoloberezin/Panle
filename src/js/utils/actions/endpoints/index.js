import { auth } from "@/js/utils/actions/endpoints/auth";
import { contacts } from "@/js/utils/actions/endpoints/contacts";
import { audioClips } from "@/js/utils/actions/endpoints/audioClips";
import { users } from "@/js/utils/actions/endpoints/users";
import { sse } from "@/js/utils/actions/endpoints/sse";
import { scenarios } from "@/js/utils/actions/endpoints/scenarios";
import { campaign } from "@/js/utils/actions/endpoints/campaign";
import {statistic} from "@/js/utils/actions/endpoints/statistic";

export const endpoints = {
    auth, contacts, audioClips, users, sse, scenarios, campaign, statistic
}
