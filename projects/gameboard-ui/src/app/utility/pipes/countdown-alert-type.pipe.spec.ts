import { ConfigService } from '../config.service';
import { CountdownAlertPipe } from './countdown-alert-type.pipe';

describe('CountdownAlertPipe', () => {
  it('create an instance', () => {
    const pipe = new CountdownAlertPipe();
    expect(pipe).toBeTruthy();
  });

  fit('should return "danger" when below the threshold to display seconds', () => {
    const fakeConfig = {
      settings: { countdownStartSecondsAtMinute: 60 }
    };

    const pipe = new CountdownAlertPipe(fakeConfig as ConfigService);
    expect(pipe.transform(50)).toBe("danger");
  })
});
