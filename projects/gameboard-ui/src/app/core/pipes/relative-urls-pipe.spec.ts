import { RelativeUrlsPipe } from "./relative-urls.pipe";

describe('RelativeUrlsPipe', () => {
  it('creates an instance', () => {
    const pipe = new RelativeUrlsPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns the input if the input is falsey', () => {
    const pipe = new RelativeUrlsPipe();
    expect(pipe.transform(''!, "https://google.com")).toBe(''!);
  });

  it('appends slash to the uriBase if it doesn\'t end in slash', () => {
    const pipe = new RelativeUrlsPipe();
    expect(pipe.standardizeUriBase("https://google.com")).toBe("https://google.com/");
  });

  it('identifies relative image links correctly', () => {
    // given
    const sut = new RelativeUrlsPipe();

    // when
    const result = sut.transform("![some image text](img/image.jpg)", "https://google.com");

    // then
    expect(result).toBe("![some image text](https://google.com/img/image.jpg)");
  });
});