import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { PracticeArea } from './practice-area.entity';
import { CreatePracticeAreaDto } from './dto/create-practice-area.dto';
import { UpdatePracticeAreaDto } from './dto/update-practice-area.dto';
import { ImageService } from 'src/utils/image.service';

@Injectable()
export class PracticeAreasService {
  constructor(
    @InjectRepository(PracticeArea)
    private readonly repo: Repository<PracticeArea>,
    private readonly imageService: ImageService,
  ) {}

  async create(
    dto: CreatePracticeAreaDto,
    logoBuffer?: Buffer,
    coverBuffer?: Buffer,
  ): Promise<PracticeArea> {
    const pa = this.repo.create({ ...dto });

    if (logoBuffer) pa.logoUrl = await this.imageService.saveImage(logoBuffer);
    if (coverBuffer)
      pa.coverImageUrl = await this.imageService.saveImage(coverBuffer);

    return this.repo.save(pa);
  }

  async findAll(): Promise<PracticeArea[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<PracticeArea> {
    const pa = await this.repo.findOne({ where: { id } });
    if (!pa) throw new NotFoundException('PracticeArea not found');
    return pa;
  }
  async findBySlug(slug: string): Promise<PracticeArea> {
    const practiceArea = await this.repo.findOne({ where: { slug } });
    if (!practiceArea) {
      throw new NotFoundException(`Practice area not found: ${slug}`);
    }
    return practiceArea;
  }

  async update(
    id: string,
    dto: UpdatePracticeAreaDto,
    logoBuffer?: Buffer,
    coverBuffer?: Buffer,
  ): Promise<PracticeArea> {
    const pa = await this.findOne(id);

    if (logoBuffer) {
      if (pa.logoUrl) await this.imageService.deleteImage(pa.logoUrl);
      pa.logoUrl = await this.imageService.saveImage(logoBuffer);
    }

    if (coverBuffer) {
      if (pa.coverImageUrl)
        await this.imageService.deleteImage(pa.coverImageUrl);
      pa.coverImageUrl = await this.imageService.saveImage(coverBuffer);
    }

    Object.assign(pa, {
      ...dto,
      coverImageUrl: pa.coverImageUrl,
      logoUrl: pa.logoUrl,
    });
    return this.repo.save(pa);
  }

  async remove(id: string): Promise<void> {
    const pa = await this.findOne(id);

    if (pa.logoUrl) await this.imageService.deleteImage(pa.logoUrl);
    if (pa.coverImageUrl) await this.imageService.deleteImage(pa.coverImageUrl);

    await this.repo.remove(pa);
  }

  async seedPracticeAreas() {
    const languages = ['EN', 'AR', 'DE', 'RO', 'RU', 'ZH', 'IT', 'FR'];

    const areas = [
      {
        titleEN: 'Establishing Companies',
        excerptEN:
          'Professional guidance on starting and registering companies legally.',
        translations: {
          AR: {
            title: 'تأسيس الشركات',
            excerpt: 'إرشادات احترافية لبدء وتسجيل الشركات قانونيًا.',
          },
          DE: {
            title: 'Unternehmensgründung',
            excerpt:
              'Professionelle Anleitung zum Starten und rechtlichen Registrieren von Unternehmen.',
          },
          RO: {
            title: 'Înființarea Companiilor',
            excerpt:
              'Ghid profesional pentru începerea și înregistrarea legală a companiilor.',
          },
          RU: {
            title: 'Создание Компаний',
            excerpt:
              'Профессиональное руководство по созданию и регистрации компаний законно.',
          },
          ZH: {
            title: '公司成立',
            excerpt: '关于合法成立和注册公司的专业指导。',
          },
          IT: {
            title: 'Costituzione Aziende',
            excerpt:
              'Guida professionale per avviare e registrare legalmente le aziende.',
          },
          FR: {
            title: "Création d'Entreprises",
            excerpt:
              'Conseils professionnels pour démarrer et enregistrer légalement des entreprises.',
          },
        },
      },
      {
        titleEN: 'Criminal Cases',
        excerptEN: 'Expert representation and advice for criminal law cases.',
        translations: {
          AR: {
            title: 'القضايا الجنائية',
            excerpt: 'تمثيل واستشارات قانونية متخصصة في القضايا الجنائية.',
          },
          DE: {
            title: 'Strafrechtliche Fälle',
            excerpt: 'Fachkundige Vertretung und Beratung in Strafsachen.',
          },
          RO: {
            title: 'Cazuri Penale',
            excerpt:
              'Reprezentare și consultanță expertă pentru cazuri penale.',
          },
          RU: {
            title: 'Уголовные Дела',
            excerpt:
              'Экспертное представление и консультации по уголовным делам.',
          },
          ZH: { title: '刑事案件', excerpt: '刑事案件的专业代理和咨询。' },
          IT: {
            title: 'Casi Penali',
            excerpt: 'Rappresentanza e consulenza esperta in casi penali.',
          },
          FR: {
            title: 'Affaires Pénales',
            excerpt:
              "Représentation et conseils d'experts pour les affaires pénales.",
          },
        },
      },
      {
        titleEN: 'Civil Cases',
        excerptEN:
          'Legal support and consultation for civil disputes and claims.',
        translations: {
          AR: {
            title: 'القضايا المدنية',
            excerpt: 'الدعم القانوني والاستشارات للنزاعات والمطالبات المدنية.',
          },
          DE: {
            title: 'Zivilsachen',
            excerpt:
              'Rechtliche Unterstützung und Beratung bei zivilrechtlichen Streitigkeiten.',
          },
          RO: {
            title: 'Cazuri Civile',
            excerpt:
              'Asistență și consultanță juridică pentru litigii civile și cereri.',
          },
          RU: {
            title: 'Гражданские Дела',
            excerpt:
              'Юридическая поддержка и консультации по гражданским спорам.',
          },
          ZH: {
            title: '民事案件',
            excerpt: '民事纠纷和索赔的法律支持与咨询。',
          },
          IT: {
            title: 'Casi Civili',
            excerpt:
              'Supporto legale e consulenza per controversie civili e reclami.',
          },
          FR: {
            title: 'Affaires Civiles',
            excerpt:
              'Support juridique et consultation pour les litiges civils.',
          },
        },
      },
      {
        titleEN: 'Legal Consultations',
        excerptEN: 'Comprehensive legal consultations to guide your decisions.',
        translations: {
          AR: {
            title: 'الاستشارات القانونية',
            excerpt: 'استشارات قانونية شاملة لتوجيه قراراتك.',
          },
          DE: {
            title: 'Rechtsberatung',
            excerpt:
              'Umfassende rechtliche Beratung zur Unterstützung Ihrer Entscheidungen.',
          },
          RO: {
            title: 'Consultanță Juridică',
            excerpt:
              'Consultanță juridică completă pentru a vă ghida deciziile.',
          },
          RU: {
            title: 'Юридические Консультации',
            excerpt:
              'Полные юридические консультации для помощи в принятии решений.',
          },
          ZH: { title: '法律咨询', excerpt: '全面的法律咨询以指导您的决策。' },
          IT: {
            title: 'Consulenze Legali',
            excerpt: 'Consulenze legali complete per guidare le tue decisioni.',
          },
          FR: {
            title: 'Consultations Juridiques',
            excerpt:
              'Consultations juridiques complètes pour guider vos décisions.',
          },
        },
      },
      {
        titleEN: 'Financial Issues',
        excerptEN:
          'Assistance with financial regulations, disputes, and advice.',
        translations: {
          AR: {
            title: 'المسائل المالية',
            excerpt: 'مساعدة في اللوائح المالية والنزاعات والنصائح.',
          },
          DE: {
            title: 'Finanzielle Angelegenheiten',
            excerpt:
              'Unterstützung bei Finanzvorschriften, Streitigkeiten und Beratung.',
          },
          RO: {
            title: 'Probleme Financiare',
            excerpt:
              'Asistență privind reglementările financiare, disputele și sfaturile.',
          },
          RU: {
            title: 'Финансовые Вопросы',
            excerpt:
              'Помощь с финансовыми правилами, спорами и консультациями.',
          },
          ZH: { title: '财务问题', excerpt: '协助处理财务法规、纠纷和建议。' },
          IT: {
            title: 'Questioni Finanziarie',
            excerpt:
              'Assistenza su regolamenti finanziari, controversie e consulenze.',
          },
          FR: {
            title: 'Problèmes Financiers',
            excerpt:
              'Assistance sur la réglementation financière, les litiges et les conseils.',
          },
        },
      },
      {
        titleEN: 'Commercial Issues',
        excerptEN:
          'Support in commercial contracts, disputes, and negotiations.',
        translations: {
          AR: {
            title: 'المسائل التجارية',
            excerpt: 'دعم في العقود التجارية والنزاعات والمفاوضات.',
          },
          DE: {
            title: 'Handelsangelegenheiten',
            excerpt:
              'Unterstützung bei Handelsverträgen, Streitigkeiten und Verhandlungen.',
          },
          RO: {
            title: 'Probleme Comerciale',
            excerpt: 'Sprijin în contracte comerciale, dispute și negocieri.',
          },
          RU: {
            title: 'Коммерческие Вопросы',
            excerpt:
              'Поддержка по коммерческим контрактам, спорам и переговорам.',
          },
          ZH: { title: '商业问题', excerpt: '商业合同、争议和谈判支持。' },
          IT: {
            title: 'Questioni Commerciali',
            excerpt:
              'Supporto nei contratti commerciali, dispute e negoziazioni.',
          },
          FR: {
            title: 'Problèmes Commerciaux',
            excerpt:
              'Soutien dans les contrats commerciaux, litiges et négociations.',
          },
        },
      },
      {
        titleEN: 'International Issues',
        excerptEN:
          'Expertise in cross-border legal matters and international law.',
        translations: {
          AR: {
            title: 'المسائل الدولية',
            excerpt:
              'خبرة في القضايا القانونية العابرة للحدود والقانون الدولي.',
          },
          DE: {
            title: 'Internationale Angelegenheiten',
            excerpt:
              'Expertise in grenzüberschreitenden Rechtsangelegenheiten und internationalem Recht.',
          },
          RO: {
            title: 'Probleme Internaționale',
            excerpt:
              'Expertiză în probleme juridice transfrontaliere și drept internațional.',
          },
          RU: {
            title: 'Международные Вопросы',
            excerpt:
              'Экспертиза в трансграничных юридических вопросах и международном праве.',
          },
          ZH: {
            title: '国际问题',
            excerpt: '跨境法律事务和国际法的专业知识。',
          },
          IT: {
            title: 'Questioni Internazionali',
            excerpt:
              'Competenza in questioni legali transfrontaliere e diritto internazionale.',
          },
          FR: {
            title: 'Problèmes Internationaux',
            excerpt:
              'Expertise en matière juridique transfrontalière et droit international.',
          },
        },
      },
      {
        titleEN: 'RealEstate Issues',
        excerptEN:
          'Guidance on property transactions, disputes, and ownership.',
        translations: {
          AR: {
            title: 'مشاكل العقارات',
            excerpt: 'إرشادات حول المعاملات العقارية والنزاعات والملكية.',
          },
          DE: {
            title: 'Immobilienangelegenheiten',
            excerpt:
              'Anleitung zu Immobilientransaktionen, Streitigkeiten und Eigentum.',
          },
          RO: {
            title: 'Probleme Imobiliare',
            excerpt:
              'Ghid privind tranzacțiile imobiliare, disputele și proprietatea.',
          },
          RU: {
            title: 'Недвижимость',
            excerpt:
              'Руководство по сделкам с недвижимостью, спорам и собственности.',
          },
          ZH: {
            title: '房地产问题',
            excerpt: '关于房地产交易、纠纷和所有权的指导。',
          },
          IT: {
            title: 'Questioni Immobiliari',
            excerpt:
              'Guida sulle transazioni immobiliari, controversie e proprietà.',
          },
          FR: {
            title: 'Problèmes Immobiliers',
            excerpt:
              'Guidance sur les transactions immobilières, les litiges et la propriété.',
          },
        },
      },
    ];

    for (const area of areas) {
      const slug = area.titleEN.toLowerCase().replace(/\s+/g, '-');
      const exists = await this.repo.findOne({ where: { slug } });
      if (exists) continue;
      const title: Record<string, string> = {};
      const excerpt: Record<string, string> = {};
      const seoTitle: Record<string, string> = {};
      const seoDescription: Record<string, string> = {};

      languages.forEach((lang) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title[lang] =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          lang === 'EN' ? area.titleEN : area.translations[lang].title;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        excerpt[lang] =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          lang === 'EN' ? area.excerptEN : area.translations[lang].excerpt;
        seoTitle[lang] = `${title[lang]} | Our Law Firm`;
        seoDescription[lang] = excerpt[lang];
      });

      const pa: DeepPartial<PracticeArea> = {
        slug,
        title,
        excerpt,
        contentHtml: {},
        seoMeta: {
          title: seoTitle,
          description: seoDescription,
        },
      };
      await this.repo.save(pa);
    }

    return 'Practice areas seeded successfully with translations!';
  }
}
