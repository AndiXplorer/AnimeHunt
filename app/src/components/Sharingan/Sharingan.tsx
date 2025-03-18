import './sharingan.css';

export const Sharingan = () => {
  return (
    <div className="sharingan">
      <div className="container">
        <div className="box">
          <div className="eye-box left-eye">
            <div className="eye circle sharingan1to2">
              <div className="eyeball center">
                <div className="circle"></div>
                <div className="circle center"></div>
                <div className="sp">
                  <span className="center">,</span>
                </div>
                <div className="sp">
                  <span className="center">,</span>
                </div>
                <div className="sp">
                  <span className="center">,</span>
                </div>
              </div>
            </div>
          </div>
          <div className="eye-box">
            <div className="eye circle sharingan1to2">
              <div className="eyeball center">
                <div className="circle"></div>
                <div className="circle center"></div>
                <div className="sp">
                  <span className="center">,</span>
                </div>
                <div className="sp">
                  <span className="center">,</span>
                </div>
                <div className="sp">
                  <span className="center">,</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="eye circle sharingan1">
            <div className="eyeball center">
              <div className="circle"></div>
              <div className="circle center"></div>
              <div className="sp">
                <span className="center">,</span>
              </div>
              <div className="sp">
                <span className="center">,</span>
              </div>
              <div className="sp">
                <span className="center">,</span>
              </div>
            </div>
          </div>
          <div className="eye circle sharingan2">
            <div className="eyeball center">
              <div className="circle"></div>
              <div className="circle center"></div>
              <div className="sp">
                <span className="center">,</span>
              </div>
              <div className="sp">
                <span className="center">,</span>
              </div>
              <div className="sp">
                <span className="center">,</span>
              </div>
            </div>
          </div>
        </div>
        <div className="quote">
          <p>
            <i>
              Wake up to reality.
              <br />
              Nothing ever goes as planned in this cursed world.
            </i>
          </p>
        </div>
      </div>
    </div>
  );
};
