import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface YoutubeChannelInterface {
  id?: string;
  channel_name: string;
  company_id?: string;
  views: number;
  earnings: number;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface YoutubeChannelGetQueryInterface extends GetQueryInterface {
  id?: string;
  channel_name?: string;
  company_id?: string;
}
