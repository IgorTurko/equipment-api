export enum EquipmentStatusEnum {
  RUNNING = 'running',
  STOPPED = 'stopped',
}

export class Equipment {
  code: string;
  address: string;
  start_date: string;
  end_date: string;
  status: EquipmentStatusEnum;
}
