export enum EquipmentStatusEnum {
  RUNNING = 'running',
  STOPPED = 'stopped',
}

export class Equipment {
  code: string;
  address: string;
  start_date: string | null;
  end_date: string | null;
  status: EquipmentStatusEnum;
}
