import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { vi } from 'vitest'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
    private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Resposta criada porem SEM salvar no banco
    const aggregate = CustomAggregate.create()

    // Espero que o EVENTO tenha sido criado porem NAO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Salvando a resposta no banco e DISPARANDO o EVENTO
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Espero que o subscriber faça o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
