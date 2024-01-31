import { Config } from '~/types/config';

export const config = Config.parse(JSON.parse(process.env.OLEK_CONFIG!));
