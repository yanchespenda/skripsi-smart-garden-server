export interface CronData {
  seconds?: string;
  minutes?: string;
  hours?: string;
}

export interface ActionHistoryList {
  createdAt: Date | string;
  action: string;
  from: string;
}

export interface ActionHistory {
  total: number;
  list: ActionHistoryList[];
}

