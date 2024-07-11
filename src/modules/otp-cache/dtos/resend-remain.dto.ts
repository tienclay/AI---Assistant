export class ResendRemainingDto {
  remaining: number;

  // use this property to set lock account 1H or 24H
  // If isLockedBefore is false -> lock 1H
  // Else lock 24H
  isLockedBefore?: boolean = false;
}
