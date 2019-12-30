import {action, decorate, observable} from "mobx";
import {ConvergenceDomain, Convergence} from "@convergence/convergence";

export class ConvergenceDomainStore {
  public domain: ConvergenceDomain | null = null;

  public connect(domainUrl: string): Promise<void> {
    return Convergence.connectAnonymously(domainUrl, "")
      .then(domain => {
        this._setDomain(domain);
        return;
      })
      .catch(err => {
        console.error(err);
      });
  }

  public disconnect(): void {
    if (this.domain !== null) {
      if (this.domain.session().isConnected()) {
        this.domain.dispose();
      }
    }
    this.domain = null;
  }

  public _setDomain(domain: ConvergenceDomain): void {
    this.domain = domain;
  }
}

decorate(ConvergenceDomainStore, {
  domain: observable,
  connect: action,
  disconnect: action,
  _setDomain: action
});
